CREATE TRIGGER after_user_signups
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION populate_user_data();
