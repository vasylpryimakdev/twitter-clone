import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import {
  createPostSchema,
  type PostFormData,
} from "../shared/schemas/post-schema";
import { useEffect, useState } from "react";
import { useCreatePost, usePost, useUpdatePost } from "../hooks/usePosts";
import { deleteImage, uploadImage } from "../services/storage.service";
import { handleError } from "../shared/errors/handleError";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

const PostFormPage = () => {
  const [submitting, setSubmitting] = useState(false);

  const { id } = useParams();

  const isEditMode = !!id;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<PostFormData>({
    resolver: zodResolver(createPostSchema),
    mode: "onChange",
  });

  const { data: post, isLoading: isPostLoading } = usePost(id);

  const createPost = useCreatePost();
  const updatePost = useUpdatePost(id!);
  const mutation = isEditMode ? updatePost : createPost;

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        text: post.text,
        imageUrl: post.imageUrl ?? "",
      });
    }
  }, [post, reset]);

  const onSubmit = async (data: PostFormData) => {
    let uploadedImageUrl: string | null = null;

    setSubmitting(true);

    try {
      if (data.imageUrl instanceof File) {
        uploadedImageUrl = await uploadImage(data.imageUrl);
      }

      await mutation.mutateAsync({
        title: data.title,
        text: data.text,
        imageUrl:
          uploadedImageUrl ??
          (typeof data.imageUrl === "string" ? data.imageUrl : null),
      });
    } catch (err) {
      if (uploadedImageUrl) {
        await deleteImage(uploadedImageUrl);
      }

      handleError(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (isEditMode && isPostLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", mt: 4, height: "100%" }}
    >
      <Paper sx={{ width: 600, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {isEditMode ? "Edit post" : "Create post"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset
            disabled={submitting}
            style={{
              border: 0,
              padding: 0,
              margin: 0,
              minWidth: 0,
            }}
          >
            <TextField
              fullWidth
              label="Title"
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Text"
              {...register("text")}
              error={!!errors.text}
              helperText={errors.text?.message}
              sx={{ mb: 2 }}
            />

            <Controller
              name="imageUrl"
              control={control}
              render={({ field, fieldState }) => {
                const value = field.value;

                const preview =
                  value instanceof File
                    ? URL.createObjectURL(value)
                    : typeof value === "string"
                      ? value
                      : null;

                const handleFileChange = (
                  e: React.ChangeEvent<HTMLInputElement>,
                ) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  field.onChange(file);
                };

                return (
                  <Box sx={{ mb: 2 }}>
                    {!preview ? (
                      <Box
                        component="label"
                        sx={{
                          height: 180,
                          border: "2px dashed",
                          borderColor: "divider",
                          borderRadius: 3,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          backgroundColor: "grey.50",
                          transition: "all 0.2s ease",
                          gap: 1,

                          "&:hover": {
                            borderColor: "primary.main",
                            backgroundColor: "rgba(25, 118, 210, 0.04)",
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        <PhotoCameraIcon
                          sx={{ fontSize: 40, color: "text.secondary" }}
                        />

                        <Typography variant="body2" color="text.secondary">
                          Click to upload image
                        </Typography>

                        <Typography variant="caption" color="text.disabled">
                          PNG, JPG up to 10MB
                        </Typography>
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </Box>
                    ) : (
                      <Box sx={{ position: "relative" }}>
                        <Box
                          component="img"
                          src={preview}
                          sx={{ width: "100%" }}
                        />

                        <Button
                          onClick={() => field.onChange(null)}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            minWidth: 36,
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            backgroundColor: "#fff",
                            color: "error.main",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            "&:hover": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </Box>
                    )}

                    {fieldState.error && (
                      <Typography color="error">
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </Box>
                );
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                disabled={!isValid || submitting}
                loading={submitting}
              >
                {isEditMode ? "Update" : "Post"}
              </Button>
            </Box>
          </fieldset>
        </form>
      </Paper>
    </Box>
  );
};

export default PostFormPage;
