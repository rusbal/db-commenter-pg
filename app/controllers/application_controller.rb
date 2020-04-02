class ApplicationController < ActionController::Base
  before_action :check_user_session

 private

  def check_user_session
    return if controller_name == 'signin'
    return unless session[:user_id].nil?

    redirect_to controller: 'signin', action: 'new'
  end
end
