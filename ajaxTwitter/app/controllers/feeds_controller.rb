class FeedsController < ApplicationController
  before_action :require_logged_in!

  LIMIT = 20 # that's how we know what the limit is 

  def show
    @feed_tweets =
      current_user.feed_tweets(LIMIT, params[:max_created_at]).includes(:user)
    
		respond_to do |format| # replaces render :show
		  format.html { render :show }
		  format.json { render :show }
		end
  end
end
