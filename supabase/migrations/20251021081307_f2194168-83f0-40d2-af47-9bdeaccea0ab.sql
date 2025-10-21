-- Fix user_roles table: Add policies for role management
CREATE POLICY "Admins can assign roles" ON user_roles
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can remove roles" ON user_roles
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles" ON user_roles
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Prevent admins from removing their own admin role
CREATE POLICY "Admins cannot remove own admin role" ON user_roles
  FOR DELETE
  USING (NOT (user_id = auth.uid() AND role = 'admin'));

-- Auto-assign first user as admin
CREATE OR REPLACE FUNCTION auto_assign_first_admin()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- If this is the first user, make them admin
  IF (SELECT COUNT(*) FROM auth.users) = 1 THEN
    INSERT INTO user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER assign_first_admin_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_first_admin();