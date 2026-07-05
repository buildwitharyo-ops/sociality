"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserAvatar } from "@/components/user-avatar";
import { ErrorState } from "@/components/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { applyApiError } from "@/features/auth/form-helpers";
import type { MyProfile } from "@/lib/api";
import { useMe } from "./use-me";
import { useUpdateMe } from "./use-update-me";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED = ["image/png", "image/jpeg"];

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function EditProfile() {
  const me = useMe();

  if (me.isPending) return <EditSkeleton />;
  if (me.isError || !me.data) {
    return (
      <div className="mx-auto w-full max-w-lg p-4">
        <ErrorState title="Couldn't load your profile" onRetry={() => me.refetch()} />
      </div>
    );
  }

  return <EditProfileForm profile={me.data} />;
}

function EditProfileForm({ profile }: { profile: MyProfile }) {
  const router = useRouter();
  const updateMe = useUpdateMe();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const previewRef = useRef<string | null>(null);
  useEffect(() => {
    previewRef.current = avatarPreview;
  }, [avatarPreview]);
  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    [],
  );

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile.name,
      username: profile.username,
      phone: profile.phone ?? "",
      bio: profile.bio ?? "",
    },
  });

  // Re-sync the prefilled values if the profile refreshes — but only while the
  // form is untouched, so we never discard in-progress edits.
  useEffect(() => {
    if (!form.formState.isDirty) {
      form.reset({
        name: profile.name,
        username: profile.username,
        phone: profile.phone ?? "",
        bio: profile.bio ?? "",
      });
    }
  }, [profile, form]);

  function chooseAvatar(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setAvatarError("Please choose a PNG or JPG image.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setAvatarError("Image must be 5 MB or smaller.");
      return;
    }
    setAvatarError(null);
    setAvatarFile(file);
    setAvatarPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
  }

  function openPicker() {
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
      avatarInputRef.current.click();
    }
  }

  async function onSubmit(values: Values) {
    setFormError(null);
    try {
      if (avatarFile) {
        const body = new FormData();
        body.append("name", values.name);
        body.append("username", values.username);
        body.append("phone", values.phone ?? "");
        body.append("bio", values.bio ?? "");
        body.append("avatar", avatarFile);
        await updateMe.mutateAsync(body);
      } else {
        await updateMe.mutateAsync({
          name: values.name,
          username: values.username,
          phone: values.phone ?? "",
          bio: values.bio ?? "",
        });
      }
    } catch (error) {
      applyApiError<Values>(error, ["name", "username", "phone", "bio"], form.setError, setFormError);
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg p-4">
      <header className="mb-5 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-lg font-semibold">Edit Profile</h1>
      </header>

      <div className="mb-6 flex flex-col items-center gap-3">
        {avatarPreview ? (
          <div className="relative size-20 overflow-hidden rounded-full">
            <Image src={avatarPreview} alt="Avatar preview" fill className="object-cover" unoptimized />
          </div>
        ) : (
          <UserAvatar name={profile.name} avatarUrl={profile.avatarUrl} className="size-20" />
        )}
        <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={openPicker}>
          Change Photo
        </Button>
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(event) => chooseAvatar(event.target.files?.[0])}
        />
        {avatarError ? <p className="text-sm text-destructive">{avatarError}</p> : null}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" value={profile.email} disabled readOnly />
          </div>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="Your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="Tell people about yourself" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
          <Button type="submit" className="w-full rounded-full" disabled={updateMe.isPending}>
            {updateMe.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

function EditSkeleton() {
  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-4">
      <Skeleton className="mx-auto size-20 rounded-full" />
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}
