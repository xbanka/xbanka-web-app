export const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");
  return name[0] + "***" + name.slice(-1) + "@" + domain;
};
