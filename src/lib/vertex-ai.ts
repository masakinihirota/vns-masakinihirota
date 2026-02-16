import { VertexAI } from '@google-cloud/vertexai';

/**
 * Vertex AI の初期化インスタンスを取得します。
 * 環境変数 GOOGLE_CLOUD_PROJECT および GOOGLE_CLOUD_LOCATION を使用します。
 */
const project = process.env.GOOGLE_CLOUD_PROJECT ?? '';
const location = process.env.GOOGLE_CLOUD_LOCATION ?? 'asia-northeast1';

// Vertex AI インスタンスの作成
const vertexAI = new VertexAI({ project, location });

/**
 * 指定したモデル（デフォルトは gemini-1.5-flash）を取得します。
 * @param modelName モデル名
 * @returns GenerativeModel インスタンス
 */
export const getGenerativeModel = (modelName = 'gemini-1.5-flash') => {
  return vertexAI.getGenerativeModel({ model: modelName });
};

/**
 * テキスト入力を受け取り、AIによる回答を生成します。
 * @param prompt プロンプト
 * @returns 生成されたテキスト
 */
export const generateContent = async (prompt: string): Promise<string> => {
  try {
    const model = getGenerativeModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    return text ?? '回答を生成できませんでした。';
  } catch (error) {
    console.error('Vertex AI Error:', error);
    throw new Error('AIによる生成に失敗しました。プロジェクトIDやリージョンの設定を確認してください。');
  }
};
