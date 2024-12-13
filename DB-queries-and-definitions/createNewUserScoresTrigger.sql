create trigger create_new_user_scores
  after insert on auth.users
  for each row execute procedure public.create_new_user_scores();
