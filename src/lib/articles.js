import { apiFetch } from "./api";

export function getArticles() {
  return apiFetch("/articles/");
}

export function getArticle(id) {
  return apiFetch(`/articles/${id}`);
}

export function createArticle(data) {
  return apiFetch("/articles/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function updateArticle(id, data) {
  return apiFetch(`/articles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function deleteArticle(id) {
  return apiFetch(`/articles/${id}`, {
    method: "DELETE",
  });
}
