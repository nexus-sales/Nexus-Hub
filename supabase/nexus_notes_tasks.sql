-- Nexus Hub: internal notes, tasks, and task notifications.
-- Run this in the Supabase SQL editor for the project.

create extension if not exists pgcrypto;

create table if not exists public.nexus_notes (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    content text not null,
    category text default 'general',
    visibility text not null default 'team' check (visibility in ('private', 'team', 'admin')),
    pinned boolean not null default false,
    created_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.nexus_tasks (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text default '',
    status text not null default 'pending' check (status in ('pending', 'active', 'completed', 'cancelled')),
    priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
    assigned_to uuid references auth.users(id) on delete set null,
    created_by uuid references auth.users(id) on delete set null,
    lead_id uuid references public.nexus_leads(id) on delete set null,
    due_at timestamptz,
    activated_at timestamptz,
    completed_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.nexus_notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    type text not null,
    title text not null,
    body text,
    entity_type text,
    entity_id uuid,
    read_at timestamptz,
    created_at timestamptz not null default now()
);

create index if not exists nexus_notes_created_by_idx on public.nexus_notes(created_by);
create index if not exists nexus_notes_updated_at_idx on public.nexus_notes(updated_at desc);
create index if not exists nexus_tasks_status_idx on public.nexus_tasks(status);
create index if not exists nexus_tasks_assigned_to_idx on public.nexus_tasks(assigned_to);
create index if not exists nexus_tasks_due_at_idx on public.nexus_tasks(due_at);
create index if not exists nexus_notifications_user_read_idx on public.nexus_notifications(user_id, read_at);

create or replace function public.nexus_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists nexus_notes_touch_updated_at on public.nexus_notes;
create trigger nexus_notes_touch_updated_at
before update on public.nexus_notes
for each row execute function public.nexus_touch_updated_at();

drop trigger if exists nexus_tasks_touch_updated_at on public.nexus_tasks;
create trigger nexus_tasks_touch_updated_at
before update on public.nexus_tasks
for each row execute function public.nexus_touch_updated_at();

create or replace function public.nexus_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.profiles
        where profiles.id = auth.uid()
          and profiles.role = 'admin'
    );
$$;

create or replace function public.nexus_create_task_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if new.status in ('pending', 'active') and new.assigned_to is not null then
        insert into public.nexus_notifications (
            user_id,
            type,
            title,
            body,
            entity_type,
            entity_id
        )
        values (
            new.assigned_to,
            case when new.status = 'active' then 'task_active' else 'task_pending' end,
            case when new.status = 'active' then 'Tarea activa' else 'Tarea pendiente' end,
            new.title,
            'task',
            new.id
        );
    end if;

    return new;
end;
$$;

drop trigger if exists nexus_tasks_notify_insert on public.nexus_tasks;
create trigger nexus_tasks_notify_insert
after insert on public.nexus_tasks
for each row execute function public.nexus_create_task_notification();

drop trigger if exists nexus_tasks_notify_active_update on public.nexus_tasks;
create trigger nexus_tasks_notify_active_update
after update of status, assigned_to on public.nexus_tasks
for each row
when (
    new.status in ('pending', 'active')
    and new.assigned_to is not null
    and (
        old.status is distinct from new.status
        or old.assigned_to is distinct from new.assigned_to
    )
)
execute function public.nexus_create_task_notification();

alter table public.nexus_notes enable row level security;
alter table public.nexus_tasks enable row level security;
alter table public.nexus_notifications enable row level security;

drop policy if exists "notes readable by authenticated users" on public.nexus_notes;
create policy "notes readable by authenticated users"
on public.nexus_notes for select
to authenticated
using (
    visibility = 'team'
    or created_by = auth.uid()
    or public.nexus_is_admin()
);

drop policy if exists "notes writable by admins and owners" on public.nexus_notes;
create policy "notes writable by admins and owners"
on public.nexus_notes for all
to authenticated
using (created_by = auth.uid() or public.nexus_is_admin())
with check (created_by = auth.uid() or public.nexus_is_admin());

drop policy if exists "tasks readable by assignee creators and admins" on public.nexus_tasks;
create policy "tasks readable by assignee creators and admins"
on public.nexus_tasks for select
to authenticated
using (
    assigned_to is null
    or assigned_to = auth.uid()
    or created_by = auth.uid()
    or public.nexus_is_admin()
);

drop policy if exists "tasks writable by admins" on public.nexus_tasks;
create policy "tasks writable by admins"
on public.nexus_tasks for all
to authenticated
using (public.nexus_is_admin())
with check (public.nexus_is_admin());

drop policy if exists "notifications readable by owner" on public.nexus_notifications;
create policy "notifications readable by owner"
on public.nexus_notifications for select
to authenticated
using (user_id = auth.uid() or public.nexus_is_admin());

drop policy if exists "notifications updatable by owner" on public.nexus_notifications;
create policy "notifications updatable by owner"
on public.nexus_notifications for update
to authenticated
using (user_id = auth.uid() or public.nexus_is_admin())
with check (user_id = auth.uid() or public.nexus_is_admin());

do $$
begin
    if not exists (
        select 1 from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'nexus_tasks'
    ) then
        alter publication supabase_realtime add table public.nexus_tasks;
    end if;

    if not exists (
        select 1 from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'nexus_notifications'
    ) then
        alter publication supabase_realtime add table public.nexus_notifications;
    end if;
end;
$$;
