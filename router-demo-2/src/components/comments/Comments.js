import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import classes from './Comments.module.css';
import useHttp from '../../hooks/use-http';
import { getAllComments } from '../../lib/api';
import NewCommentForm from './NewCommentForm';
import LoadingSpinner from '../UI/LoadingSpinner';
import CommentsList from './CommentsList';

const Comments = () => {
  const { sendRequest, status, data: loadedComments } = useHttp(getAllComments);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const params = useParams();
  const { quoteId } = params;

  const startAddCommentHandler = () => {
    setIsAddingComment(true);
  };

  const addedCommentHandler = useCallback(() => {
    sendRequest(quoteId)
  }, [sendRequest, quoteId]);

  let comments;

  if (status === 'pending') {
    comments = (
      <div className="centered">
        <LoadingSpinner/>
      </div>
    );
  }

  if (status === 'completed' && loadedComments && loadedComments.length > 0) {
    comments = (
      <CommentsList comments={loadedComments}/>
    );
  }

  if (status === 'completed' && (!loadedComments || loadedComments.length === 0)) {
    comments = <p className="centered">No comments were added yet!</p>;
  }

  useEffect(() => {
    sendRequest(quoteId)
  }, [sendRequest, quoteId]);
  
  return (
    <section className={classes.comments}>
      <h2>User Comments</h2>
      {!isAddingComment && (
        <button className='btn' onClick={startAddCommentHandler}>
          Add a Comment
        </button>
      )}
      {isAddingComment && (<NewCommentForm quoteId={quoteId} onAddedComment={addedCommentHandler}/>)}
      {comments}
    </section>
  );
};

export default Comments;