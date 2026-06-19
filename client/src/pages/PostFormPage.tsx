import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postsService } from "../services/posts.service";
import { useNavigate, useParams } from "react-router-dom";
import {
  createPostSchema,
  type PostFormData,
} from "../shared/schemas/post-schema";
import { useEffect } from "react";
import { useToastStore } from "../stores/toast.store";
import { handleError } from "../shared/errors/handleError";

const PostFormPage = () => {
  const showToast = useToastStore((s) => s.showToast);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  const imageUrl = useWatch({
    control,
    name: "imageUrl",
  });

  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => postsService.getPostById(id!),
    enabled: isEditMode,
    retry: false,
  });

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        text: post.text,
        imageUrl: post.imageUrl ?? "",
      });
    }
  }, [post, reset]);

  const mutation = useMutation({
    mutationFn: (data: PostFormData) => {
      if (isEditMode) {
        return postsService.updatePost(id!, data);
      }

      return postsService.createPost(data);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      showToast(
        isEditMode ? "Post updated successfully" : "Post created successfully",
      );

      navigate("/");
    },

    onError: handleError,
  });

  const onSubmit = (data: PostFormData) => {
    mutation.mutate(data);
  };

  const isLoading = isPostLoading || mutation.isPending;

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
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper sx={{ width: 600, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {isEditMode ? "Edit post" : "Create post"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset
            disabled={isLoading}
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

            <TextField
              fullWidth
              label="Image URL (optional)"
              {...register("imageUrl")}
              error={!!errors.imageUrl}
              helperText={errors.imageUrl?.message}
              sx={{ mb: 2 }}
            />

            {imageUrl && !errors.imageUrl && (
              <Box
                component="img"
                src={imageUrl}
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  mb: 2,
                }}
              />
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                disabled={!isValid || isLoading}
                loading={mutation.isPending}
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
