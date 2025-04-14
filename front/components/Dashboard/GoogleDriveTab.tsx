"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserStore } from "@/config/UserStore";
import {
  GetGoogleToken,
  DriveList,
  ShareDriveFolder,
  GetDriveFolder,
} from "@/actions/projects/projectActions";
import { IconBrandGoogleDrive } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

export function GoogleDriveTab({
  projectID,
  isowner,
}: {
  projectID: string;
  isowner: boolean;
}) {
  const { toast } = useToast();
  const user = useUserStore((state) => state.user);
  const [driveList, setDriveList] = useState<any[]>([]);
  const [token, setToken] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<any>(null);
  const [embedUrl, setEmbedUrl] = useState<string>("");
  const [isSettingPermissions, setIsSettingPermissions] = useState(false);

  const handleGoogleAuth = async () => {
    window.location.href = `/api/auth/google?userId=${user?.id}&drive=true`;
  };

  const handleSetFolderPermissions = async () => {
    if (!selectedFolder) return;

    setIsSettingPermissions(true);
    try {
      const response = await ShareDriveFolder(projectID, selectedFolder.id);
      if (response.success) {
        setEmbedUrl(response.embedUrl);
        toast({
          title: "Success!",
          description: "Folder is now shared with your team",
        });
      } else {
        toast({
          title: "Error!",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: "Failed to share folder",
        variant: "destructive",
      });
    } finally {
      setIsSettingPermissions(false);
    }
  };

  useEffect(() => {
    if (token && isowner) {
      // Only fetch drive list if owner
      const fetchDriveList = async () => {
        const response = await DriveList(projectID);
        if (response.success) {
          setDriveList(response.folders);
        } else {
          toast({
            title: "Error!",
            description: response.message,
            variant: "destructive",
          });
        }
      };
      fetchDriveList();
    }
  }, [token, projectID, isowner]);

  useEffect(() => {
    if (isowner) {
      // Only fetch token if owner
      const fetchToken = async () => {
        const response = await GetGoogleToken(projectID);
        if (response.success) {
          setToken(response.token);
        }
      };
      fetchToken();
    }
  }, [projectID, isowner]);

  useEffect(() => {
    // All users can see the embedded folder
    const fetchEmbedUrl = async () => {
      const response = await GetDriveFolder(projectID);

      if (response.success) {
        setEmbedUrl(response.url);
      }
    };
    fetchEmbedUrl();
  }, [projectID]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="View Google Drive">
          <IconBrandGoogleDrive />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Google Drive Integration</DialogTitle>
          <DialogDescription>
            {isowner
              ? "Select a folder to share with your team,Please note that this will overwrite any existing permissions."
              : "View the shared Google Drive folder"}
          </DialogDescription>
        </DialogHeader>

        {/* Always show the embedded folder if available */}
        {embedUrl && (
          <div className="mt-4 border rounded-lg overflow-hidden">
            <iframe
              src={embedUrl}
              className="w-full h-[500px]"
              frameBorder="0"
              title="Google Drive Folder"
              allowFullScreen
            />
            <div className="p-2 bg-gray-100 dark:bg-gray-800 text-center">
              <a
                href={embedUrl.replace("/preview", "/view")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm"
              >
                Open in Google Drive
              </a>
            </div>
          </div>
        )}

        {/* Only show folder selection and sharing controls to owners */}
        {isowner && (
          <div className="space-y-4 mt-4">
            {token ? (
              <>
                {driveList.length > 0 ? (
                  <>
                    <div>
                      <Label htmlFor="folders" className="text-white mb-3">
                        Drive Folders
                      </Label>
                      <Select
                        onValueChange={(value) => {
                          const folder = driveList.find((f) => f.id === value);
                          setSelectedFolder(folder);
                        }}
                        value={selectedFolder?.id || ""}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a folder" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Drive Folders</SelectLabel>
                            {driveList.map((folder) => (
                              <SelectItem key={folder.id} value={folder.id}>
                                {folder.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedFolder && (
                      <Button
                        onClick={handleSetFolderPermissions}
                        disabled={isSettingPermissions}
                        className="w-full"
                      >
                        {isSettingPermissions
                          ? "Setting Permissions..."
                          : "Share Folder with Team"}
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p>No folders found in your Google Drive</p>
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={handleGoogleAuth}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-5 h-5 mr-2"
                      >
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      Connect Google Drive
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleAuth}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Connect Google Drive
                </Button>
              </div>
            )}
          </div>
        )}
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
