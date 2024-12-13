CREATE OR REPLACE FUNCTION populate_user_data()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO userstats (id, flex_score, spd_score, end_score, str_score, overall_score)
  VALUES (NEW.id, 0, 0, 0, 0, 0);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
