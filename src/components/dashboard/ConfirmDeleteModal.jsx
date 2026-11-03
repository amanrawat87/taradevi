import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this record? This action cannot be undone.",
  isDeleting = false,
  confirmText = "Delete",
  loadingText = "Deleting..."
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isDeleting && onClose()}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="flex flex-col items-center text-center sm:text-center sm:items-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <p className="text-muted-foreground text-sm mt-2">
            {message}
          </p>
        </DialogHeader>
        <DialogFooter className="flex gap-3 justify-center sm:justify-center w-full mt-6">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isDeleting}
            className="flex-1 rounded-full font-medium"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={isDeleting}
            className="flex-1 rounded-full font-medium bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20"
          >
            {isDeleting ? loadingText : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
