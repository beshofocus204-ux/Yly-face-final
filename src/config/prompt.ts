/**
 * Centralized constant for the Gemini Face Swap request prompt.
 * This exact prompt must be sent to Gemini with:
 * IMAGE 1 = EXACT SELECTED CHARACTER IMAGE / BASE IMAGE
 * IMAGE 2 = USER UPLOADED PHOTO / IDENTITY REFERENCE
 */
export const FACE_SWAP_PROMPT = `IMAGE 1 IS THE BASE CHARACTER IMAGE.
IMAGE 2 IS THE USER IDENTITY REFERENCE.

Use IMAGE 1 as the exact and exclusive base image.

Use IMAGE 2 only for the user's facial identity and natural facial features.

Replace the facial identity/head area of the character in IMAGE 1 with the identity of the person in IMAGE 2.

Keep the exact character from IMAGE 1.

Do not create another character.
Do not search for another character.
Do not retrieve another image.
Do not invent a replacement character.
Do not use any character reference other than IMAGE 1.

Preserve the character's body, proportions, clothing, costume, accessories, hands, arms, legs, shoes, props, pose, gesture, camera angle, perspective, composition, background, environment, lighting, shadows, colors and overall visual style.

Do not use the user's clothing or body.

Only use the user's facial identity.

Adapt the user's face naturally to the character's head position, angle, scale, perspective, expression and lighting.

The final result must look like the real person naturally became the EXACT selected character.

Keep everything outside the facial identity/head area as close as possible to IMAGE 1.

IMPORTANT:
IMAGE 1 = EXACT SELECTED CHARACTER.
IMAGE 2 = USER.
Never substitute IMAGE 1.
Never generate a new character.`;
