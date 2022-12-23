import axiosInstance from './axiosInstance';

const fetchRoles = async () => {
  try {
    const resp = await axiosInstance.get('/admin/roles');
    return resp.data.data;
  } catch (err) {
    throw new Error(err);
  }
};

const fetchUserRoles = async () => {
  try {
    const {
      data: {
        data: { roles },
      },
    } = await axiosInstance.get('/admin/users/me');

    return roles;
  } catch (err) {
    throw new Error(err);
  }
};

export { fetchRoles, fetchUserRoles };
