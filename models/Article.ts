import { initDB, createModel } from 'lyzr-architect';

let _model: any = null;
export default async function getArticleModel() {
  if (!_model) {
    await initDB();
    _model = createModel('Article', {
      title: { type: String, required: true },
      topic: { type: String, required: true },
      content: { type: String, default: '' },
      summary: { type: String, default: '' },
      sources: { type: [{ title: String, url: String }], default: [] },
      sections: { type: [{ heading: String, content: String }], default: [] },
      word_count: { type: Number, default: 0 },
      status: { type: String, enum: ['generating', 'completed', 'failed'], default: 'generating' },
    });
  }
  return _model;
}
