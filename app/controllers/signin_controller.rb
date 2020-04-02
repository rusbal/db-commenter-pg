class SigninController < ApplicationController

  def new
    redirect_to "/" if session[:user_id] == 1
  end

  def create
    if params[:password] == "thequickbrownfox"
      session[:user_id] = 1
      redirect_to "/"
    else
      @error_message = "Invalid password"
      render 'new'
    end
  end

end
