# Antes do Pix

> Pare. Confira. Só depois decida.

Aplicativo mobile nativo para Android e iOS que ajuda a identificar sinais de risco em mensagens, links, telefones, chaves Pix e QR Codes antes do pagamento.

## Checkpoint atual

Este checkpoint entrega o fluxo manual local:

`Início → entrada manual → conferência → análise → resultado`

A análise é determinística, funciona sem internet e guarda o texto somente em memória durante o fluxo. O app não acessa banco, carteira ou conta, não solicita senha e não inicia pagamentos.

O app recebe texto e links pelo menu nativo de compartilhamento do Android e pela Share Extension do iOS. Essa integração exige um development build; o Expo Go não carrega módulos nativos de compartilhamento. A câmera só é solicitada ao abrir o scanner e o áudio não é usado. Não há garantia de segurança: o resultado serve para ajudar a pessoa a pausar e confirmar o beneficiário no aplicativo do banco.

## Desenvolvimento

```bash
npm install
npm start
```

Para testar câmera e compartilhamento nativos, gere um development build:

```bash
npx expo prebuild --no-install
npx expo run:android
npx expo run:ios
```

As pastas `android/` e `ios/` geradas localmente não são versionadas; o EAS pode regenerá-las a partir do `app.json`.

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
- O scanner solicita somente câmera na etapa própria; o app não usa contatos, localização ou microfone.

## Limites importantes

O app não confirma titularidade bancária, não registra denúncias automaticamente e não usa expressões como “transação segura”, “golpe confirmado” ou “100% confiável”.

## Stack

Expo SDK 57, React Native, TypeScript, Expo Router, Zustand, Zod, Jest, expo-camera e expo-share-intent.
