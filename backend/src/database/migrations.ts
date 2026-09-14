import db from '../database/connection';

export async function up() {
  // Users table
  await db.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('username').unique().notNullable();
    table.string('display_name');
    table.text('bio');
    table.string('avatar_url');
    table.string('cover_url');
    table.string('website');
    table.string('location');
    table.boolean('is_verified').defaultTo(false);
    table.boolean('is_private').defaultTo(false);
    table.boolean('is_banned').defaultTo(false);
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.timestamp('updated_at').defaultTo(db.fn.now());
    table.timestamp('last_login_at');
  });

  // Videos table
  await db.schema.createTable('videos', (table) => {
    table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('video_url').notNullable();
    table.string('thumbnail_url');
    table.text('caption');
    table.string('audio_track');
    table.json('hashtags').defaultTo('[]');
    table.integer('views_count').defaultTo(0);
    table.integer('likes_count').defaultTo(0);
    table.integer('comments_count').defaultTo(0);
    table.integer('shares_count').defaultTo(0);
    table.integer('saves_count').defaultTo(0);
    table.integer('duration').notNullable(); // in seconds
    table.enum('visibility', ['public', 'private', 'friends']).defaultTo('public');
    table.boolean('allow_comments').defaultTo(true);
    table.boolean('allow_duets').defaultTo(true);
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.timestamp('updated_at').defaultTo(db.fn.now());
    table.index('user_id');
    table.index('created_at');
  });

  // Comments table
  await db.schema.createTable('comments', (table) => {
    table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    table.uuid('video_id').notNullable().references('id').inTable('videos').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('parent_comment_id').references('id').inTable('comments').onDelete('CASCADE');
    table.text('text_content');
    table.string('voice_comment_url');
    table.integer('voice_duration');
    table.integer('likes_count').defaultTo(0);
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.timestamp('updated_at').defaultTo(db.fn.now());
    table.index('video_id');
    table.index('user_id');
  });

  // Likes table
  await db.schema.createTable('likes', (table) => {
    table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('video_id').notNullable().references('id').inTable('videos').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.unique(['user_id', 'video_id']);
    table.index('user_id');
    table.index('video_id');
  });

  // Follows table
  await db.schema.createTable('follows', (table) => {
    table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    table.uuid('follower_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('following_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.unique(['follower_id', 'following_id']);
    table.index('follower_id');
    table.index('following_id');
  });

  // Messages table
  await db.schema.createTable('messages', (table) => {
    table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    table.uuid('conversation_id').notNullable().references('id').inTable('conversations').onDelete('CASCADE');
    table.uuid('sender_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.text('text_content');
    table.string('image_url');
    table.string('video_url');
    table.string('voice_url');
    table.integer('voice_duration');
    table.uuid('reply_to_id').references('id').inTable('messages');
    table.boolean('is_deleted').defaultTo(false);
    table.timestamp('read_at');
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.timestamp('updated_at').defaultTo(db.fn.now());
    table.index('conversation_id');
    table.index('sender_id');
  });

  // Conversations table
  await db.schema.createTable('conversations', (table) => {
    table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    table.uuid('user_id_1').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('user_id_2').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('last_message_at');
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.timestamp('updated_at').defaultTo(db.fn.now());
    table.unique(['user_id_1', 'user_id_2']);
    table.index('user_id_1');
    table.index('user_id_2');
  });

  // Notifications table
  await db.schema.createTable('notifications', (table) => {
    table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('actor_id').references('id').inTable('users').onDelete('SET NULL');
    table.enum('type', ['like', 'comment', 'follow', 'mention', 'share', 'message']).notNullable();
    table.uuid('video_id').references('id').inTable('videos').onDelete('CASCADE');
    table.uuid('comment_id').references('id').inTable('comments').onDelete('CASCADE');
    table.text('message');
    table.boolean('is_read').defaultTo(false);
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.index('user_id');
    table.index('is_read');
  });

  // Saves table (bookmarks)
  await db.schema.createTable('saves', (table) => {
    table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('video_id').notNullable().references('id').inTable('videos').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.unique(['user_id', 'video_id']);
    table.index('user_id');
  });

  // Blocks table
  await db.schema.createTable('blocks', (table) => {
    table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    table.uuid('blocker_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('blocked_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.unique(['blocker_id', 'blocked_id']);
    table.index('blocker_id');
  });

  // Reports table
  await db.schema.createTable('reports', (table) => {
    table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    table.uuid('reporter_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('video_id').references('id').inTable('videos').onDelete('CASCADE');
    table.uuid('comment_id').references('id').inTable('comments').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.enum('reason', ['spam', 'violence', 'harassment', 'hate_speech', 'explicit', 'copyright', 'other']).notNullable();
    table.text('description');
    table.enum('status', ['pending', 'reviewed', 'resolved', 'dismissed']).defaultTo('pending');
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.timestamp('reviewed_at');
    table.index('status');
  });
}

export async function down() {
  await db.schema.dropTableIfExists('reports');
  await db.schema.dropTableIfExists('blocks');
  await db.schema.dropTableIfExists('saves');
  await db.schema.dropTableIfExists('notifications');
  await db.schema.dropTableIfExists('messages');
  await db.schema.dropTableIfExists('conversations');
  await db.schema.dropTableIfExists('follows');
  await db.schema.dropTableIfExists('likes');
  await db.schema.dropTableIfExists('comments');
  await db.schema.dropTableIfExists('videos');
  await db.schema.dropTableIfExists('users');
}
