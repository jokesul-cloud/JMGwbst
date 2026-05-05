-- Seed data for Golf Splooch Lessons

-- Insert a few series
INSERT INTO series (id, title, description, thumbnail_url, trailer_url, price_cents, category, is_published)
VALUES 
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Mastering the Driver', 'Learn how to hit longer, straighter drives with consistent power.', 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=800', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 4900, 'Swing Mechanics', true),
  ('b2c3d4e5-f6a7-4b5c-8d9e-1f2a3b4c5d6e', 'Short Game Secrets', 'Master chipping, pitching, and bunker shots to save strokes around the green.', 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&q=80&w=800', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 3900, 'Short Game', true),
  ('c3d4e5f6-a7b8-4c5d-8e9f-2a3b4c5d6e7f', 'The Mental Edge', 'Develop the focus and resilience needed to perform under pressure.', 'https://images.unsplash.com/photo-1592919016381-99f6a7409825?auto=format&fit=crop&q=80&w=800', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 2900, 'Mental Game', true);

-- Insert videos for 'Mastering the Driver'
INSERT INTO videos (series_id, title, description, video_url, thumbnail_url, position, duration_seconds)
VALUES
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Introduction to the Driver', 'Setting the stage for power and accuracy.', 'https://example.com/video1.mp4', 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=800', 1, 300),
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'The Perfect Grip', 'How to hold the club for maximum control.', 'https://example.com/video2.mp4', 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=800', 2, 450),
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Loading the Power', 'Techniques for a powerful backswing.', 'https://example.com/video3.mp4', 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=800', 3, 600);

-- Insert videos for 'Short Game Secrets'
INSERT INTO videos (series_id, title, description, video_url, thumbnail_url, position, duration_seconds)
VALUES
  ('b2c3d4e5-f6a7-4b5c-8d9e-1f2a3b4c5d6e', 'The Basic Chip Shot', 'Consistency from just off the green.', 'https://example.com/video4.mp4', 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&q=80&w=800', 1, 350),
  ('b2c3d4e5-f6a7-4b5c-8d9e-1f2a3b4c5d6e', 'Escaping the Bunker', 'How to get out every time.', 'https://example.com/video5.mp4', 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&q=80&w=800', 2, 500);
