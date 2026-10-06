// Scripts Lua executados no servidor Redis. Ficam num arquivo puro para os testes rodarem
// exatamente o mesmo script num redis-server real.

/**
 * Cria a conta reivindicando o pagamento, numa operação atômica:
 * duas requisições simultâneas com o mesmo pagamento nunca criam duas contas.
 *   KEYS[1] = reivindicação do pagamento   ARGV[1] = dono (user:<hash>)
 *   KEYS[2] = usuário                      ARGV[2] = JSON do usuário
 *   KEYS[3] = acesso (entitlement)         ARGV[3] = JSON "active"
 * O acesso só é gravado se ainda não existir: se um reembolso chegou pelo webhook no meio do
 * caminho, a revogação vence.
 */
export const CREATE_USER_SCRIPT = `
if redis.call("EXISTS", KEYS[1]) == 1 then return "payment_claimed" end
if redis.call("EXISTS", KEYS[2]) == 1 then return "user_exists" end
redis.call("SET", KEYS[1], ARGV[1])
redis.call("SET", KEYS[2], ARGV[2])
redis.call("SET", KEYS[3], ARGV[3], "NX")
return "ok"
`;

export type CreateUserResult = "ok" | "payment_claimed" | "user_exists";
