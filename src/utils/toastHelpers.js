// src/utils/toastHelpers.js
// import { toast } from 'react-toastify';
import { toast } from 'sonner';

const defaultStyle = {
  background: '#000',
  color: '#fff',
};

export const notifySuccess = (message) => {
  toast.success(message, { style: defaultStyle });
};

export const notifyError = (message) => {
  toast.error(message, { style: defaultStyle });
};

export const notifyInfo = (message) => {
  toast.info(message, { style: defaultStyle });
};
