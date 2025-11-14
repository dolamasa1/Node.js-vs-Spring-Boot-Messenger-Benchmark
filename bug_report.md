---
name: 🐛 Bug Report
about: Report unexpected behavior or performance issues
title: '[BUG] '
labels: bug, needs-triage
assignees: ''

---

## 🐛 Bug Description
A clear and concise description of what the bug is.

## 🔧 Environment Details
**Please complete the following information:**
- OS: [e.g. Ubuntu 22.04, Windows 11, macOS 14]
- Java Version: [e.g. 17.0.9]
- Node.js Version: [e.g. 18.17.0] 
- Go Version: [e.g. 1.21.0]
- MySQL Version: [e.g. 8.0.34]
- Hardware: [e.g. 8GB RAM, 4-core CPU]

## 📋 Reproduction Steps
Steps to reproduce the behavior:
1. Start service '...'
2. Configure test with '...'
3. Run benchmark '...'
4. See error or performance issue

## ✅ Expected Behavior
A clear description of what you expected to happen, including expected performance metrics.

## 📊 Actual Behavior
What actually happened, including actual performance measurements.

## 📈 Performance Impact
**Quantify the performance impact:**
- Response time change: [e.g. +50ms average]
- Throughput change: [e.g. -100 req/sec] 
- Success rate change: [e.g. 95% → 85%]
- Memory usage change: [e.g. +200MB]

## 📷 Screenshots/Logs
If applicable, add screenshots or relevant log output.

## 🔍 Additional Context
Add any other context about the problem here.

## 🎯 Reproduction Code
```bash
# Commands to reproduce

📝 Checklist
I've included all relevant environment details

I've provided clear reproduction steps

I've quantified the performance impact

I've checked existing issues for duplicates
```
---

## **.github/ISSUE_TEMPLATE/feature_request.md**

```markdown
---
name: 🚀 Feature Request
about: Suggest a new backend, test scenario, or performance improvement
title: '[FEATURE] '
labels: enhancement, needs-review
assignees: ''

---

## 🎯 Feature Type
- [ ] New Backend Implementation
- [ ] Performance Test Scenario
- [ ] Frontend Real-time Feature
- [ ] Measurement Accuracy Improvement
- [ ] Documentation/Example
- [ ] Other

## 🔬 Problem Statement
A clear and concise description of what problem this feature solves or what gap it fills in performance measurement.

## 💡 Proposed Solution
A clear and concise description of what you want to happen.

## 📊 Performance Justification
**How does this feature improve measurement accuracy or usefulness?**
- [ ] Adds new backend technology comparison
- [ ] Improves real-world scenario simulation
- [ ] Reduces measurement overhead
- [ ] Enhances statistical significance
- [ ] Provides better visualization/interpretation

## 🎪 Use Case Examples
Describe specific scenarios where this feature would be valuable:
1. When testing [specific workload]...
2. When comparing [specific technologies]...
3. When measuring [specific metric]...

## 🔧 Technical Specifications
**For Backend Implementations:**
- Technology: [e.g., Go, Python, .NET]
- Framework: [e.g., Gin, FastAPI, ASP.NET Core]
- Key dependencies: [list major libraries]

**For Test Scenarios:**
- Workload type: [e.g., chat bursts, file uploads, presence updates]
- Concurrent users: [estimated range]
- Data volume: [message size, frequency]

## 📈 Expected Impact
**What performance insights will this provide?**
- New comparison dimensions: [e.g., memory efficiency, startup time]
- Real-world relevance: [e.g., e-commerce, social media, enterprise]
- Measurement improvements: [e.g., reduced variance, better percentiles]

## 🔄 Alternatives Considered
A clear and concise description of any alternative solutions or features you've considered.

## 📚 Additional Context
Add any other context or screenshots about the feature request here.

## 🤝 Contribution Willingness
- [ ] I'm willing to implement this feature
- [ ] I need guidance to implement this feature
- [ ] I'm requesting this as a user need

## 📝 Checklist
- [ ] This feature aligns with project's scientific measurement goals
- [ ] This doesn't introduce artificial optimizations
- [ ] This maintains consistent API contracts
- [ ] This provides genuine performance insights
