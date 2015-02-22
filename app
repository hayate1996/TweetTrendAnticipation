# -*- coding: utf-8 -*-
# count.rb
require 'csv'
require 'natto'
require 'pp'
require 'twitter'
require 'tweetstream'
require 'json'
require 'fileutils'
require 'MeCab'


TweetStream.configure do |config|
  config.consumer_key = 'BGTuRGTfFnUUxSarSswhA',
  config.consumer_secret = '91sjht13HbtMNf8RJvyX7ia00Z9LmOsMxEF7o8wSC0',
  config.oauth_token = '600384789-pv9ORfn1v3NT182o6JGwVVXfuC9Cu0mW37amGoT7',
  config.oauth_token_secret = 'XKxNJYx2xyjfPX2BBCshWV0UQGBxO0itmn8zNEzXWxHFP',
  config.auth_method = :oauth
end



client = TweetStream::Client.new
client.on_inited do
  puts 'connection..'
end

nm = Natto::MeCab.new
t_map = {}

@statuses = []
client.sample do |status|
  if status.user.lang == "ja" && !status.text.index("RT") && !status.text.index("http:") && !status.text.index("@") && !status.text.index("https:") && !status.text.index("jp") && !status.text.index("com")
     nm.parse(status[5]) do |n|
          t_map[n.surface] = t_map[n.surface] ? t_map[n.surface] + 1 : 1
          @statuses << status
           client.stop if @statuses.size >= 100
        end
     end
   end

t_map = t_map.sort_by {|k, v| v}

File.open('latest.csv', 'w'){|f|
  t_map.each do |word, count|
   puts rank
   f.write "#{word}, #{count}\n"
 end
 }
