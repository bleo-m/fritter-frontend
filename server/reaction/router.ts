import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ReactionCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as reactionValidator from '../reaction/middleware';
import * as util from './util';
import {Types} from 'mongoose';
import type {emotion} from './model';

const router = express.Router();

/**
 * Get all the reactions
 *
 * @name GET /api/reactions
 *
 * @return {FreetResponse[]} - A list of all the reactions sorted in descending
 *                      order by date modified
 */
/**
 * Get reactions by freet id.
 *
 * @name GET /api/reactions?freetId=id
 *
 * @return {ReactionResponse[]} - An array of reactions under a freet with with id, freetId
 * @throws {400} - If freetId is not given
 * @throws {404} - If no freet has given freetId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if freetId query parameter was supplied
    if (req.query.freetId !== undefined) {
      next();
      return;
    }

    const allReactions = await ReactionCollection.findAll();
    const response = allReactions.map(util.constructReactionResponse);
    res.status(200).json(response);
  },
  [freetValidator.isFreetExistsInQuery],
  async (req: Request, res: Response) => {
    const {freetId} = req.query;

    const allReactions = await ReactionCollection.findAllByFreetId(
      freetId as string
    );
    const response = allReactions.map(util.constructReactionResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new Reaction on a Freet.
 *
 * @name POST /api/reactions/:freetId
 *
 * @param {string} emotion - The emotion of the reaction
 * @return {ReactionResponse} - The created reaction
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet emotion is empty or a stream of empty spaces
 * @throws {413} - If the freet emotion is more than 140 characters long
 */
router.post(
  '/:freetId',
  [
    freetValidator.isFreetExistsInParam,
    userValidator.isUserLoggedIn,
    reactionValidator.isValidEmotion,
    reactionValidator.userHasNotReactedToFreet
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const reaction = await ReactionCollection.addOne(
      userId,
      req.params.freetId,
      req.body.emotion
    );

    res.status(201).json({
      message: 'Your reaction was created successfully.',
      reaction: util.constructReactionResponse(reaction)
    });
  }
);

/**
 * Update a logged in user's Reaction on a Freet.
 *
 * @name PUT /api/reactions/:freetId/
 *
 * @param {string} emotion - The emotion of the reaction
 * @return {ReactionResponse} - The created reaction
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet emotion is empty or a stream of empty spaces
 * @throws {413} - If the freet emotion is more than 140 characters long
 */
router.put(
  '/:freetId',
  [
    freetValidator.isFreetExistsInParam,
    userValidator.isUserLoggedIn,
    reactionValidator.isValidEmotion,
    reactionValidator.userHasReactedToFreet
  ],
  async (req: Request, res: Response) => {
    const reaction = await ReactionCollection.updateOne(
      req.session.userId,
      req.params.freetId,
      req.body.emotion as emotion
    );

    res.status(201).json({
      message: 'Your reaction was updated successfully.',
      reaction: util.constructReactionResponse(reaction)
    });
  }
);

/**
 * Delete a logged in user's Reaction on a Freet.
 *
 * @name DELETE /api/reactions/:freetId/
 *
 * @return {ReactionResponse} - The created reaction
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet emotion is empty or a stream of empty spaces
 * @throws {413} - If the freet emotion is more than 140 characters long
 */
router.delete(
  '/:freetId',
  [
    freetValidator.isFreetExistsInParam,
    userValidator.isUserLoggedIn,
    reactionValidator.userHasReactedToFreet
  ],
  async (req: Request, res: Response) => {
    const success = await ReactionCollection.deleteOneByFreetIdAndUserId(
      req.params.freetId,
      req.session.userId
    );
    if (success) {
      res.status(200).json({
        message: 'Your reaction was deleted successfully.'
      });
    } else {
      res.status(500).json({
        message:
          'Internal server error. Your reaction was NOT able to be deleted.'
      });
    }
  }
);

export {router as reactionRouter};
