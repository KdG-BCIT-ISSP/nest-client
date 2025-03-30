import React, { useState } from "react";
import Dots from "@/public/svg/Article/Dots";
import Report from "@/public/svg/Article/Report";
import ThumbsUp from "@/public/svg/Post/ThumbsUp";
import Comments from "@/public/svg/Post/Comment";

// TODO: finalize and separate interface
interface Comment {
  id: number;
  author: string;
  content: string;
  time: string;
  replies: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: number, replyContent: string) => void;
}

interface CommentListProps {
  comments: Comment[];
  onReply: (parentId: number, replyContent: string) => void;
}

// mock data
const initialComments: Comment[] = [
  {
    id: 1,
    author: "Alice",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.",
    time: "20 minutes ago",
    replies: [
      {
        id: 2,
        author: "Alice",
        content:
          "Cras sit amet consectetur odio. Pellentesque habitant morbi tristique.",
        time: "10 minutes ago",
        replies: [
          {
            id: 3,
            author: "Alice",
            content:
              "Nested reply. Fusce vitae neque a nulla fermentum faucibus.",
            time: "5 minutes ago",
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    author: "Alice",
    content:
      "Another top-level comment. Fusce ultricies tortor metus, a convallis quam venenatis sed.",
    time: "2 hours ago",
    replies: [],
  },
];

function CommentItem({ comment, onReply }: CommentItemProps) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReport, setShowReport] = useState(false);

  const handleReplySubmit = () => {
    if (!replyContent.trim()) return;
    onReply(comment.id, replyContent);
    setReplyContent("");
    setShowReplyBox(false);
  };

  return (
    <div className="relative ml-4 pl-4 border-l border-gray-300 mb-4">
      <div className="flex items-center mb-1">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white mr-2 uppercase">
          {comment.author.charAt(0)}
        </div>
        <div className="font-semibold">{comment.author}</div>
        <span className="ml-2 text-xs text-gray-500">{comment.time}</span>

        <div className="ml-auto">
          <button onClick={() => setShowReport((prev) => !prev)}>
            <Dots comments />
          </button>
          {showReport && (
            <div className="absolute right-0 mt-1 z-10">
              <Report />
            </div>
          )}
        </div>
      </div>

      <div className="mb-2">{comment.content}</div>

      <div className="flex gap-4 mb-2">
        <ThumbsUp count={32} />
        <button
          className="text-sm text-tertiary hover:underline"
          onClick={() => setShowReplyBox(!showReplyBox)}
        >
          <Comments count={34} />
        </button>
      </div>

      {/* Reply Text Area */}
      {showReplyBox && (
        <div className="flex gap-2 mt-2 h-10">
          <textarea
            className="flex-1 p- border rounded border-gray-300"
            placeholder="Write a reply"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondaryPressed"
            onClick={handleReplySubmit}
          >
            Submit
          </button>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentList({ comments, onReply }: CommentListProps) {
  return (
    <div>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} onReply={onReply} />
      ))}
    </div>
  );
}

export default function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now(),
      author: "Alice", // TODO: replace with actual user
      content: newComment,
      time: "Just now",
      replies: [],
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  // Add a reply to a specific comment (by ID)
  const handleReply = (parentId: number, replyContent: string) => {
    const addReply = (commentList: Comment[]): Comment[] =>
      commentList.map((c) => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: [
              ...c.replies,
              {
                id: Date.now(),
                author: "Alice",
                content: replyContent,
                time: "Just now",
                replies: [],
              },
            ],
          };
        } else if (c.replies && c.replies.length > 0) {
          return { ...c, replies: addReply(c.replies) };
        }
        return c;
      });

    setComments((prevComments) => addReply(prevComments));
  };

  return (
    <div className="w-full mx-auto font-sans text-gray-800 py-10">
      <div className="flex items-start mb-4 gap-2">
        <textarea
          className="flex-1 p-2 border rounded border-gray-300 h-10"
          placeholder="Write a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondaryPressed"
          onClick={handleAddComment}
        >
          Send
        </button>
      </div>

      <CommentList comments={comments} onReply={handleReply} />
    </div>
  );
}
