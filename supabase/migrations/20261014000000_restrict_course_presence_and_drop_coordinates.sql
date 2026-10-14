-- Presence rows previously stored each player's exact GPS coordinates and were
-- readable by anyone, including anonymous clients. The app never displays the
-- coordinates, so stop storing them and limit reads to signed-in users.

ALTER TABLE api.course_presence DROP COLUMN IF EXISTS latitude;
ALTER TABLE api.course_presence DROP COLUMN IF EXISTS longitude;

DROP POLICY IF EXISTS "Users can view presence at courses" ON api.course_presence;
CREATE POLICY "Authenticated users can view presence at courses"
  ON api.course_presence FOR SELECT TO authenticated USING (true);

REVOKE SELECT ON api.course_presence FROM anon;
