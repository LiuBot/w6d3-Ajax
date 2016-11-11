@tweets.each do |tweet|
  json.set! tweet.id do 
    json.extract! tweet, :content, :user_id
    json.username tweet.user.username
    json.mentioned_users tweet.mentioned_users
  end
end

# Finally, we'll write an index view for tweets. This view isn't strictly
# applicable to our current application, but it demonstrates a pattern
# that you will use in future full-stack applications, 
#particularly when we start using Redux.
# We're going to return an object filled with tweets,
# each tweet keyed by its id. It will look like the following:

# {
#   "1": {
#     "content": "Set world napping record",
#     "user_id": 1
#   },
#   "2": {
#     "content": "Jumped to the top of the shelf!",
#     "user_id": 1
#   },
# }