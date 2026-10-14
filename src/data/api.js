const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");

async function request(path, { method = "GET", token, body } = {}) {
  const headers = { Accept: "application/json" };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    throw new Error(
      `Could not reach the backend at ${API_BASE_URL}. Check that it is running and reachable from this device. ${error.message}`
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("The backend returned an invalid response.");
  }

  if (!response.ok) {
    const error = new Error(data?.error || `Request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }

  return data;
}

function itemPath(path, id) {
  return `${path}/${encodeURIComponent(id)}`;
}

export const api = {
  login(email, password) {
    return request("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
  },

  register(name, email, password) {
    return request("/api/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
  },

  logout(token) {
    return request("/api/auth/logout", { method: "POST", token });
  },

  profile(token) {
    return request("/api/profile", { token });
  },

  async getMenu() {
    const result = await request("/api/menu");
    const items = Array.isArray(result.items) ? result.items : [];

    return {
      ...result,
      items: items.filter(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          item.name.trim() &&
          typeof item.category === "string" &&
          item.category.trim() &&
          Number.isFinite(Number(item.price)) &&
          Number(item.price) > 0
      ),
    };
  },

  getOrders(token) {
    return request("/api/orders", { token });
  },

  createOrder(order, token) {
    return request("/api/orders", { method: "POST", token, body: order });
  },

  updateOrderStatus(id, status, token) {
    return request(`${itemPath("/api/orders", id)}/status`, {
      method: "PATCH",
      token,
      body: { status },
    });
  },

  getReservations(token) {
    return request("/api/reservations", { token });
  },

  createReservation(reservation, token) {
    return request("/api/reservations", {
      method: "POST",
      token,
      body: reservation,
    });
  },

  cancelReservation(id, token) {
    return request(itemPath("/api/reservations", id), {
      method: "DELETE",
      token,
    });
  },

  createReview(review, token) {
    return request("/api/reviews", { method: "POST", token, body: review });
  },

  getAccounts(token) {
    return request("/api/admin/accounts", { token });
  },

  deleteAccount(id, token) {
    return request(itemPath("/api/admin/accounts", id), {
      method: "DELETE",
      token,
    });
  },

  getDashboard(token) {
    return request("/api/admin/dashboard", { token });
  },

  createMenuItem(item, token) {
    return request("/api/menu", { method: "POST", token, body: item });
  },

  updateMenuItem(id, changes, token) {
    return request(itemPath("/api/menu", id), {
      method: "PATCH",
      token,
      body: changes,
    });
  },

  deleteMenuItem(id, token) {
    return request(itemPath("/api/menu", id), {
      method: "DELETE",
      token,
    });
  },
};
