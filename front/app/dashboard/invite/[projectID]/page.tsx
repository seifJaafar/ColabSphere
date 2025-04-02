import { GalleryVerticalEnd } from "lucide-react";
import { InviteByLink } from "@/actions/projects/projectActions";
import { Check, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ projectID: string }>;
}) {
  const projectID = (await params).projectID;
  const { success, message } = await InviteByLink(projectID);
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6  p-6 md:p-10">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {success ? (
              <div className=" flex justify-center items-center gap-3 text-green-500">
                <Check className="size-8  text-green-500" />
                <h2 className="text-xl font-semibold text-center  text-green-500">
                  Welcome to the Team !
                </h2>
              </div>
            ) : (
              <div className="flex justify-center items-center gap-3 text-red-500">
                <X className="size-8  text-red-500" />
                <h2 className="text-xl font-semibold text-center  text-red-500">
                  Error joining the team
                </h2>
              </div>
            )}
          </CardTitle>
          <CardDescription>
            <p className="my-4 text-muted-foreground text-md">{message}</p>
          </CardDescription>
          <CardContent>
            <Link href={`/dashboard/projects`} className="my-4 text-white-200 ">
              Go back to Projects
            </Link>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
