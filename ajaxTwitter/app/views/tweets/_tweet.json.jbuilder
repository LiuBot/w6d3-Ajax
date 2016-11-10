# What this code is doing is collecting the tweet's 
# information, the tweeter's information, and also information
#  about each of that tweet's mentions.


json.(tweet, *Tweet.column_names)

json.user(tweet.user, *User.column_names)

json.mentions(tweet.mentions) do |mention|
  json.(mention, *Mention.column_names)
  json.user(mention.user, *User.column_names)
end