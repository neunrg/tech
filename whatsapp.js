const WHATSAPP_PHONE_NUMBER = "917574996656";
const WHATSAPP_DEFAULT_MESSAGE =
  "Hi, I visited your website neunrg and I'm interested in your services. I would like to discuss my project.";

function buildWhatsAppMessage(context = {}) {
  if (context.customMessage) return context.customMessage;

  if (context.kind === "service" && context.name) {
    return `Hi, I'm interested in your ${context.name} service. I found it on neunrg website.`;
  }

  if (context.kind === "project" && context.name) {
    return `Hi, I saw your project '${context.name}' on neunrg. I want something similar.`;
  }

  if (context.kind === "form") {
    const lines = [
      "Hi, I visited your website neunrg and I'm interested in your services.",
      context.name ? `My name: ${context.name}` : "",
      context.email ? `My email: ${context.email}` : "",
      context.service ? `Service needed: ${context.service}` : "",
      context.details ? `Project details: ${context.details}` : "",
      "I would like to discuss my project.",
    ].filter(Boolean);

    return lines.join("\n");
  }

  return WHATSAPP_DEFAULT_MESSAGE;
}

function generateWhatsAppLink(context = {}) {
  const message = buildWhatsAppMessage(context);
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}

function applyWhatsAppLink(element, context = {}) {
  if (!element) return;

  const href = generateWhatsAppLink(context);
  const ariaLabel =
    context.ariaLabel ||
    element.getAttribute("aria-label") ||
    "Chat on WhatsApp";

  if (element.tagName === "A") {
    element.href = href;
    element.target = "_blank";
    element.rel = "noopener noreferrer";
    element.setAttribute("aria-label", ariaLabel);
    return;
  }

  element.setAttribute("type", "button");
  element.setAttribute("aria-label", ariaLabel);
  element.addEventListener("click", () => {
    window.open(href, "_blank", "noopener,noreferrer");
  });
}

window.generateWhatsAppLink = generateWhatsAppLink;
window.applyWhatsAppLink = applyWhatsAppLink;
