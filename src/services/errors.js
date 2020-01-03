import { Notification } from 'element-ui'

export const errorHandler = (error) => {
  Notification.error(error);
}