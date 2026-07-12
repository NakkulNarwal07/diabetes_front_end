export default function Page() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <div className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        {/* Header */}
        <header className="space-y-4 border-b border-neutral-800 pb-10">
          <p className="text-sm font-medium text-teal-400 tracking-wide uppercase">
            Documentation
          </p>
          <h1 className="text-3xl font-bold text-neutral-100">
            About the project
          </h1>
          <p className="text-neutral-400 leading-relaxed">
            This project is a machine learning model that predicts whether a
            person has diabetes, based on a dataset from{" "}
            
              <a href="https://www.kaggle.com/datasets/uciml/pima-indians-diabetes-database"
              className="text-teal-400 hover:text-teal-300 underline underline-offset-2"
              target="_blank"
            >
              Kaggle
            </a>
            . The model evaluates entered details and estimates how
            consistent they are with a diabetes diagnosis.
          </p>
        </header>

        {/* Dataset overview */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-neutral-100">
            About the dataset
          </h2>
          <p className="text-neutral-400 leading-relaxed">
            This dataset has 8 features and 1 target variable:
          </p>

          <ul className="grid grid-cols-2 gap-2 text-sm">
            {[
              "Pregnancies",
              "Glucose",
              "Blood Pressure",
              "Skin Thickness",
              "Insulin",
              "BMI",
              "Diabetes Pedigree Function",
              "Age",
            ].map((feature) => (
              <li
                key={feature}
                className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-neutral-300"
              >
                {feature}
              </li>
            ))}
          </ul>
        </section>

        {/* EDA section */}
        <section className="space-y-10">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-neutral-100">
              Exploratory data analysis
            </h2>
            <p className="text-neutral-400 leading-relaxed">
              During data analysis, a few things stood out.
            </p>
          </div>

          <Figure src="/imgs/Sample.png" caption="Sample of the dataset" />
          <Figure src="/imgs/shape.png" caption="Shape of the dataset" />
          <Figure src="/imgs/desc.png" caption="Description of the dataset" />
          <Figure src="/imgs/corr.png" caption="Correlation of the dataset" />

          <p className="text-neutral-400 leading-relaxed">
            Two of the eight features had very low correlation with the
            target variable, so they were dropped to avoid the curse of
            dimensionality and reduce overfitting:
          </p>

          <ul className="flex flex-wrap gap-2">
            {["Skin Thickness", "Blood Pressure"].map((feature) => (
              <li
                key={feature}
                className="bg-red-500/10 border border-red-500/30 text-red-400 rounded px-3 py-1 text-sm"
              >
                {feature} — dropped
              </li>
            ))}
          </ul>
        </section>

        {/* Univariate analysis */}
        <section className="space-y-10">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-neutral-100">
              Univariate analysis
            </h2>
            <p className="text-neutral-400 leading-relaxed">
              Individual features were plotted to understand their
              distributions.
            </p>
          </div>

          <Figure
            src="/imgs/outcome.png"
            caption="Count of outcomes with values 0 and 1"
          />
          <Figure src="/imgs/glucose.png" caption="Histogram of glucose values" />
          <Figure src="/imgs/bmi.png" caption="Histogram of BMI values" />
          <Figure src="/imgs/age.png" caption="Histogram of age values" />

          <p className="text-neutral-400 leading-relaxed">
            This step surfaced a number of issues in the dataset, covered
            below.
          </p>
        </section>

        {/* Bivariate analysis / outliers */}
        <section className="space-y-10">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-neutral-100">
              Bivariate analysis and outliers
            </h2>
            <p className="text-neutral-400 leading-relaxed">
              A scatter plot of glucose and BMI values, using the target
              variable as hue, revealed clear outliers.
            </p>
          </div>

          <Figure
            src="/imgs/outliers.png"
            caption="Outliers visible in the dataset"
          />

          <p className="text-neutral-400 leading-relaxed">
            Some rows had glucose or BMI recorded as{" "}
            <code className="bg-neutral-900 border border-neutral-800 rounded px-1.5 py-0.5 text-sm text-teal-400">
              0
            </code>
            , which isn't physiologically possible. These outliers were
            removed before training.
          </p>

          <Figure
            src="/imgs/outliers_clean.png"
            caption="Dataset after removing outliers"
          />
        </section>

        {/* Results */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-neutral-100">
              Model results
            </h2>
            <p className="text-neutral-400 leading-relaxed">
              The model was trained using an SVM algorithm.
            </p>
          </div>

          <Figure
            src="/imgs/raw_output.png"
            caption="Initial accuracy, no class weighting"
          />

          <p className="text-neutral-400 leading-relaxed">
            The confusion matrix showed the model wasn't performing as well
            as it should have on the positive class, so a{" "}
            <code className="bg-neutral-900 border border-neutral-800 rounded px-1.5 py-0.5 text-sm text-teal-400">
              class_weight
            </code>{" "}
            parameter was added.
          </p>

          <Figure
            src="/imgs/result.png"
            caption="Accuracy after adding class_weight"
          />

          <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-teal-400 font-medium">
                Final model recall
              </p>
              <p className="text-neutral-400 text-sm mt-1">
                Selected as the production model
              </p>
            </div>
            <p className="text-3xl font-bold text-teal-400">0.90</p>
          </div>
        </section>
      </div>
      </div>

  );
}

function Figure({ src, caption }) {
  return (
    <figure className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
      <img src={src} alt={caption} width={500} height={500} className="w-full" />
      <figcaption className="text-sm text-neutral-500 text-center py-3 border-t border-neutral-800">
        {caption}
      </figcaption>
    </figure>
  );
}