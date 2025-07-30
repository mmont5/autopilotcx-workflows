import { INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

// Simple sentiment analysis for aggregation
function analyzeSentiment(text: string): { sentiment: 'positive' | 'negative' | 'neutral'; score: number } {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'happy', 'satisfied', 'awesome', 'fantastic', 'helpful'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'unhappy', 'poor', 'disappointed', 'frustrated', 'angry', 'worse'];
    let score = 0;
    const lower = text.toLowerCase();
    for (const word of positiveWords) if (lower.includes(word)) score++;
    for (const word of negativeWords) if (lower.includes(word)) score--;
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (score > 0) sentiment = 'positive';
    if (score < 0) sentiment = 'negative';
    return { sentiment, score };
}

export class MaestroTrainerAgent implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'MaestroTrainerAgent',
        name: 'maestroTrainerAgent',
        icon: 'file:maestrotrainer.svg',
        group: ['transform'],
        version: 1,
        description: 'Continuous learning, analytics aggregation, and training orchestration.',
        defaults: {
            name: 'MaestroTrainerAgent',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Training Data',
                name: 'trainingData',
                type: 'json',
                default: '{}',
                description: 'Analytics, feedback, or training data to aggregate and analyze',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        let total = 0;
        let sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
        let feedbacks: string[] = [];
        let scores: number[] = [];
        let recommendations: string[] = [];
        const trends: string[] = [];

        for (let i = 0; i < items.length; i++) {
            const data = JSON.parse(this.getNodeParameter('trainingData', i) as string);
            if (Array.isArray(data.feedbacks)) {
                for (const fb of data.feedbacks) {
                    feedbacks.push(fb);
                    const sentiment = analyzeSentiment(fb);
                    sentimentCounts[sentiment.sentiment]++;
                    scores.push(sentiment.score);
                }
            }
            if (Array.isArray(data.scores)) {
                scores.push(...data.scores);
            }
            if (Array.isArray(data.recommendations)) {
                recommendations.push(...data.recommendations);
            }
            total++;
        }

        // Aggregate insights
        const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        if (sentimentCounts.positive > sentimentCounts.negative) trends.push('Positive feedback trend');
        if (sentimentCounts.negative > sentimentCounts.positive) trends.push('Negative feedback trend');
        if (avgScore > 0) trends.push('Overall positive sentiment');
        if (avgScore < 0) trends.push('Overall negative sentiment');
        if (feedbacks.length > 10) trends.push('High engagement');

        // Output
        returnData.push({
            json: {
                agent: 'MaestroTrainerAgent',
                totalInputs: total,
                feedbackCount: feedbacks.length,
                sentimentCounts,
                avgSentimentScore: avgScore,
                trends,
                recommendations,
                feedbacks,
                timestamp: new Date().toISOString(),
                // Placeholder for future ML/model training results
                modelTraining: {
                    status: 'not_implemented',
                    message: 'ML/model training will be integrated here.'
                }
            },
        });
        return [returnData];
    }
} 