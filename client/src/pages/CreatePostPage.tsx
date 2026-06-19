import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsService } from "../services/posts.service";
import { useNavigate } from "react-router-dom";
import {
  createPostSchema,
  type CreatePostFormData,
} from "../shared/schemas/create-post.schema";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    mode: "onChange",
  });

  const imageUrl = watch("imageUrl");

  const mutation = useMutation({
    mutationFn: postsService.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/");
    },
  });

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper sx={{ width: 600, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Create post
        </Typography>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
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
              disabled={!isValid || mutation.isPending}
            >
              Post
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreatePostPage;
