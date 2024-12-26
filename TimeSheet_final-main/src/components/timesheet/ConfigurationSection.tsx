import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useConfigurationStore } from "@/stores/configurationStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ConfigurationSection = () => {
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [selectedProjectId, setSelectedProjectId] = React.useState<
    string | null
  >(null);
  const [activityToDelete, setActivityToDelete] = React.useState<{
    projectId: string;
    activity: string;
  } | null>(null);
  const [newActivity, setNewActivity] = React.useState({
    activity: "",
    projectId: "",
    category: "",
    externalComment: "",
  });

  const { projects, addActivity, removeActivity } = useConfigurationStore();

  const handleAdd = () => {
    if (selectedProjectId && newActivity.activity) {
      addActivity(selectedProjectId, {
        ...newActivity,
        projectId: newActivity.projectId || selectedProjectId,
      });
      setShowAddDialog(false);
      setNewActivity({
        activity: "",
        projectId: "",
        category: "",
        externalComment: "",
      });
    }
  };

  React.useEffect(() => {
    if (selectedProjectId && !newActivity.projectId) {
      setNewActivity((prev) => ({ ...prev, projectId: selectedProjectId }));
    }
  }, [selectedProjectId]);

  return (
    <Card className="p-6 bg-background text-white border border-border">
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Konfiguration</h2>
          <p className="text-sm text-gray-400">
            Verwalten Sie Ihre Projektkonfigurationen
          </p>
        </div>

        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.projectId} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedProjectId(project.projectId);
                    setShowAddDialog(true);
                  }}
                  className="text-[#4CAF50] hover:text-[#4CAF50] hover:bg-[#4CAF50]/10"
                >
                  <Plus className="w-4 h-4 mr-2" /> Aktivität hinzufügen
                </Button>
              </div>

              <div className="relative overflow-x-auto rounded-md border border-border">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-secondary">
                    <tr>
                      <th className="px-4 py-3 text-gray-400">Aktivität</th>
                      <th className="px-4 py-3 text-gray-400">Project ID</th>
                      <th className="px-4 py-3 text-gray-400">Category</th>
                      <th className="px-4 py-3 text-gray-400">
                        External Comment
                      </th>
                      <th className="px-4 py-3 text-gray-400 w-[100px]">
                        Aktionen
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.activities.map((activity, index) => (
                      <tr
                        key={index}
                        className="border-t border-border hover:bg-secondary/50"
                      >
                        <td className="px-4 py-3">{activity.activity}</td>
                        <td className="px-4 py-3">{activity.projectId}</td>
                        <td className="px-4 py-3">{activity.category}</td>
                        <td className="px-4 py-3">
                          {activity.externalComment}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-red-500/20 hover:text-red-500"
                            onClick={() =>
                              setActivityToDelete({
                                projectId: project.projectId,
                                activity: activity.activity,
                              })
                            }
                          >
                            <Trash2 className="w-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Aktivität hinzufügen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Project ID</Label>
              <Input
                value={newActivity.projectId}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, projectId: e.target.value })
                }
                className="bg-secondary"
                placeholder={selectedProjectId || ""}
              />
            </div>
            <div className="space-y-2">
              <Label>Aktivität</Label>
              <Input
                value={newActivity.activity}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, activity: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={newActivity.category}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, category: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>External Comment</Label>
              <Input
                value={newActivity.externalComment}
                onChange={(e) =>
                  setNewActivity({
                    ...newActivity,
                    externalComment: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAdd} disabled={!newActivity.activity}>
              Hinzufügen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!activityToDelete}
        onOpenChange={() => setActivityToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aktivität löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie diese Aktivität löschen möchten? Diese
              Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (activityToDelete) {
                  removeActivity(
                    activityToDelete.projectId,
                    activityToDelete.activity,
                  );
                  setActivityToDelete(null);
                }
              }}
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ConfigurationSection;
