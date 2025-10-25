const REALM = "Protected";

const unauthorizedResponse = () =>
  new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}"`,
    },
  });

type MiddlewareContext = {
  request: Request;
  env: {
    BASIC_AUTH_USER?: string;
    BASIC_AUTH_PASS?: string;
  };
  next: () => Promise<Response>;
};

export const onRequest = async (context: MiddlewareContext) => {
  const { env, request, next } = context;
  const username = env.BASIC_AUTH_USER;
  const password = env.BASIC_AUTH_PASS;

  if (!username || !password) {
    console.error(
      "Basic auth credentials are not configured in environment variables.",
    );
    return new Response("Configuration error", { status: 500 });
  }

  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return unauthorizedResponse();
  }

  let credentials = "";

  try {
    credentials = atob(authHeader.slice(6));
  } catch (error) {
    console.warn("Failed to decode Authorization header", error);
    return unauthorizedResponse();
  }

  const separatorIndex = credentials.indexOf(":");

  if (separatorIndex === -1) {
    return unauthorizedResponse();
  }

  const providedUser = credentials.slice(0, separatorIndex);
  const providedPass = credentials.slice(separatorIndex + 1);

  if (providedUser !== username || providedPass !== password) {
    return unauthorizedResponse();
  }

  return next();
};
