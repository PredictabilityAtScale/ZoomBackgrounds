export function Instructions() {
  return (
    <div className="panel instructions-panel">
      <div className="panel__header">
        <h2>📋 How to Use</h2>
        <p>Create professional backgrounds in minutes</p>
      </div>
      
      <div className="instructions-content">
        <div className="instruction-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Enter Company Details</h3>
            <p>Fill in your company name, website, and tagline.</p>
          </div>
        </div>

        <div className="instruction-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Upload Your Logo</h3>
            <p>Upload your company logo. PNG with transparency works best.</p>
          </div>
        </div>

        <div className="instruction-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Choose a Background</h3>
            <p>Select a theme that matches your brand.</p>
          </div>
        </div>

        <div className="instruction-step">
          <div className="step-number">4</div>
          <div className="step-content">
            <h3>Add Team Members</h3>
            <p>Add names, titles, locations, and optional social links.</p>
          </div>
        </div>

        <div className="instruction-step">
          <div className="step-number">5</div>
          <div className="step-content">
            <h3>Preview & Adjust</h3>
            <p>Toggle mirror view and adjust scales as needed.</p>
          </div>
        </div>

        <div className="instruction-step">
          <div className="step-number">6</div>
          <div className="step-content">
            <h3>Download</h3>
            <p>Download individual or all backgrounds as a ZIP.</p>
          </div>
        </div>
      </div>

      <div className="instructions-tip">
        <strong>💡 Pro Tip:</strong> Use mirrored versions for Zoom/Teams so text appears correctly.
      </div>
    </div>
  )
}
