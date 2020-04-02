Rails.application.routes.draw do
  root 'commenter#index'

  resources :commenter, only: [:index, :create]
  resources :signin, only: [:new, :create]
end
