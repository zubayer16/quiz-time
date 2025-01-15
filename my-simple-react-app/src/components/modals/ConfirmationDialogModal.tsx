// src/components/ConfirmationDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Loader2 } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  children?: React.ReactNode;
  confirmButtonVarient?:
    | 'default'
    | 'link'
    | 'secondary'
    | 'outline'
    | 'destructive'
    | 'ghost'
    | null;
}

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  children,
  confirmButtonVarient = 'default',
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {children && <div className='py-4'>{children}</div>}

        <DialogFooter className='flex gap-2'>
          <Button variant='outline' onClick={onClose} disabled={isLoading}>
            {cancelButtonText}
          </Button>
          <Button onClick={onConfirm} disabled={isLoading} variant={confirmButtonVarient}>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Submitting...
              </>
            ) : (
              confirmButtonText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
