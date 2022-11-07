/* eslint-disable no-warning-comments */
import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Reaction, PopulatedReaction, emotion} from '../Reaction/model';

type ReactionResponse = {
  _id: string;
  username: string;
  freetId: string;
  emotion: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string =>
  moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Reaction object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Reaction>} reaction - A reaction
 * @returns {ReactionResponse} - The reaction object formatted for the frontend
 */
const constructReactionResponse = (
  reaction: HydratedDocument<Reaction>
): ReactionResponse => {
  const reactionCopy: PopulatedReaction = {
    ...reaction.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = reactionCopy.authorId;
  delete reactionCopy.authorId;
  delete reactionCopy.dateCreated;
  delete reactionCopy.dateModified;
  return {
    ...reactionCopy,
    _id: reactionCopy._id.toString(),
    username,
    freetId: reactionCopy.freetId._id.toString(), // TODO: Subject to change
    emotion: `${reactionCopy.emotion}` // Turn emotion type into a string for frontend readability
  };
};

export {constructReactionResponse};
