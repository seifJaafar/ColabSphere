import { GalleryVerticalEnd } from "lucide-react";
import { ResetForm } from "@/components/static/resetPassword";
export default async function ResetpasswordPage({
  params,
}: {
  params: Promise<{ userID: string; resetToken: string }>;
}) {
  const { userID, resetToken } = await params;
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6  p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          ColabSphere
        </a>
        <ResetForm userID={userID} resetToken={resetToken} />
      </div>
    </div>
  );
}
