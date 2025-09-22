import toast from 'react-hot-toast';

export const handleApiError = (error: unknown) => {
  const err = error as {
    response?: { data?: { error_description?: string; message?: string } };
    message?: string;
  };
  if (err.response?.data?.error_description) {
    toast.error(err.response.data.error_description);
  } else if (err.response?.data?.message) {
    toast.error(err.response.data.message);
  } else if (err.message) {
    toast.error(err.message);
  } else {
    toast.error('发生意外错误');
  }
};
