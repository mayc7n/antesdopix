# Antes do Pix

> Pare. Confira. Só depois decida.

Aplicativo mobile nativo para Android e iOS que ajuda a identificar sinais de risco em mensagens, links, telefones, chaves Pix e QR Codes antes do pagamento.

## Primeiro checkpoint

Este checkpoint entrega o fluxo manual local:

`Início → entrada manual → conferência → análise → resultado`

A análise é determinística, funciona sem internet e guarda o texto somente em memória durante o fluxo. O app não acessa banco, carteira ou conta, não solicita senha e não inicia pagamentos.

O app recebe texto e links pelo menu nativo de compartilhamento do Android e pela Share Extension do iOS. Essa integração exige um development build; o Expo Go não carrega módulos nativos de compartilhamento. Não há garantia de segurança: o resultado serve para ajudar a pessoa a pausar e confirmar o beneficiário no aplicativo do banco.

## Desenvolvimento

```bash
npm install
npm start
```

Comandos de validação:

```bash
npm run typecheck
npm test -- --runInBand
npm run check
```

## Privacidade por padrão

- O texto bruto não é enviado para servidor nem escrito em logs.
- A análise atual não é persistida e pode ser apagada pelo usuário.
- O resultado compartilhável não inclui a mensagem original por padrão.
- O primeiro checkpoint não pede câmera, contatos, localização, microfone ou permissões financeiras.

## Limites importantes

O app não confirma titularidade bancária, não registra denúncias automaticamente e não usa expressões como “transação segura”, “golpe confirmado” ou “100% confiável”.

## Stack

Expo SDK 57, React Native, TypeScript, Expo Router, Zustand, Zod, Jest, expo-camera e expo-share-intent.
