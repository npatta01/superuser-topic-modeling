import gensim


class ModelExporter:
    def __init__(self, model_path):
        lda = gensim.models.LdaMulticore.load(model_path)
        self.model = lda

    def topics(self, num_words=10):
        top_list_counts = self.model.show_topics(num_topics=self.model.num_topics, num_words=num_words, formatted=False)

        topic_outs = []

        for idx, t in enumerate(top_list_counts):
            to = self.__create_topic_output(idx, t)
            topic_outs.append(to)

        return topic_outs

    def topic(self, topic_id, num_words=10):
        topic_count = self.model.show_topic(topic_id, num_words)
        topic_map = self.__create_topic_output(topic_id, topic_count)
        return topic_map

    def __create_topic_output(self, topic_id, counts):
        t_out = {'topic_id': topic_id}
        top_5_words = [item[1] for item in counts]
        t_out['name'] = '_'.join(top_5_words)
        counts_map = []
        for item in counts:
            counts_map.append({'text': item[1], 'weight': item[0]})
        t_out['counts'] = counts_map
        return t_out
