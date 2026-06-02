
export const groupNotificationsByDate = (notifications: any[]) => {
  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  const groups: Record<string, any[]> = {
    Today: [],
    Yesterday: [],
    Earlier: [],
  };

  notifications.forEach((notification) => {
    const date = new Date(notification.createdAt);

    const notificationDay = date.toDateString();

    if (notificationDay === today.toDateString()) {
      groups.Today.push(notification);
    } else if (notificationDay === yesterday.toDateString()) {
      groups.Yesterday.push(notification);
    } else {
      groups.Earlier.push(notification);
    }
  });

  return groups;
};