"use client";

import { useActionState, useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfile } from "@/services/profile/updateProfile";
import { UserInfo } from "@/types/user.interface";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import InputFieldError from "@/components/shared/InputFieldError";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProfileFormProps {
  userInfo: UserInfo;
  onSuccess?: () => void;
}

export default function ProfileForm({ userInfo, onSuccess }: ProfileFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(updateProfile, null);
  const [, startTransition] = useTransition();

  // Form state
  const [fullName, setFullName] = useState(
    userInfo.fullName || userInfo.name || ""
  );
  const [bio, setBio] = useState(userInfo.bio || "");
  const [location, setLocation] = useState(userInfo.location || "");
  const [interests, setInterests] = useState<string[]>(
    userInfo.interests || []
  );
  const [visitedCountries, setVisitedCountries] = useState<string[]>(
    userInfo.visitedCountries || []
  );
  const [interestInput, setInterestInput] = useState("");
  const [countryInput, setCountryInput] = useState("");

  // Reset form when userInfo changes
  useEffect(() => {
    startTransition(() => {
      setFullName(userInfo.fullName || userInfo.name || "");
      setBio(userInfo.bio || "");
      setLocation(userInfo.location || "");
      setInterests(userInfo.interests || []);
      setVisitedCountries(userInfo.visitedCountries || []);
    });
  }, [userInfo]);

  // Handle success/error with useEffect
  useEffect(() => {
    if (state?.success) {
      const message =
        typeof state.message === "string"
          ? state.message
          : typeof state.message === "object" && state.message !== null
          ? JSON.stringify(state.message)
          : "Profile updated successfully";

      toast.success(message);
      router.refresh();
      if (onSuccess) {
        onSuccess();
      }
    } else if (state && state.success === false && state.message) {
      const message =
        typeof state.message === "string"
          ? state.message
          : typeof state.message === "object" && state.message !== null
          ? JSON.stringify(state.message)
          : "Failed to update profile";

      toast.error(message);
    }
  }, [state, router, onSuccess]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (fullName) {
      formData.append("fullName", fullName);
    }
    if (bio) {
      formData.append("bio", bio);
    }
    if (location) {
      formData.append("location", location);
    }
    formData.append("interests", JSON.stringify(interests));
    formData.append("visitedCountries", JSON.stringify(visitedCountries));

    formAction(formData);
  };

  const addInterest = () => {
    const trimmed = interestInput.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setInterestInput("");
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const addCountry = () => {
    const trimmed = countryInput.trim();
    if (trimmed && !visitedCountries.includes(trimmed)) {
      setVisitedCountries([...visitedCountries, trimmed]);
      setCountryInput("");
    }
  };

  const removeCountry = (country: string) => {
    setVisitedCountries(visitedCountries.filter((c) => c !== country));
  };

  const handleInterestKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addInterest();
    }
  };

  const handleCountryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCountry();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
            {state && <InputFieldError field="fullName" state={state} />}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {bio.length}/500 characters
            </p>
            {state && <InputFieldError field="bio" state={state} />}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
            />
            {state && <InputFieldError field="location" state={state} />}
          </div>
        </CardContent>
      </Card>

      {/* Interests */}
      <Card>
        <CardHeader>
          <CardTitle>Interests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={handleInterestKeyDown}
              placeholder="Add an interest and press Enter"
            />
            <Button type="button" onClick={addInterest} variant="outline">
              Add
            </Button>
          </div>
          {interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <Badge key={index} variant="outline" className="gap-1">
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visited Countries */}
      <Card>
        <CardHeader>
          <CardTitle>Visited Countries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={countryInput}
              onChange={(e) => setCountryInput(e.target.value)}
              onKeyDown={handleCountryKeyDown}
              placeholder="Add a country and press Enter"
            />
            <Button type="button" onClick={addCountry} variant="outline">
              Add
            </Button>
          </div>
          {visitedCountries.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {visitedCountries.map((country, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {country}
                  <button
                    type="button"
                    onClick={() => removeCountry(country)}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          disabled={state?.success === false && !state.message}
        >
          {state?.success === false && !state.message
            ? "Updating..."
            : "Update Profile"}
        </Button>
      </div>
    </form>
  );
}
