import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateSignup = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    display_name: Joi.string().max(50),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateVideoUpload = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    caption: Joi.string().max(500),
    hashtags: Joi.array().items(Joi.string()),
    visibility: Joi.string().valid('public', 'private', 'friends'),
    allow_comments: Joi.boolean(),
    allow_duets: Joi.boolean(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateComment = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    text_content: Joi.string().required(),
    parent_comment_id: Joi.string().uuid(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
