#!/bin/bash

# AutopilotCX Documentation Cleanup Script
# This script consolidates and organizes the documentation structure

set -e  # Exit on any error

echo "🚀 Starting AutopilotCX Documentation Cleanup..."

# Create backup
BACKUP_DIR="docs-backup-$(date +%Y%m%d-%H%M%S)"
echo "📦 Creating backup: $BACKUP_DIR"
cp -r docs "$BACKUP_DIR"

# Create new directory structure
echo "📁 Creating new directory structure..."
mkdir -p docs/{development,implementation,business,testing,deployment}

# Move files to new locations
echo "📋 Moving files to new locations..."

# Development files
if [ -f "docs/frontend-auth-integration.md" ]; then
    mv docs/frontend-auth-integration.md docs/development/
    echo "  ✓ Moved frontend-auth-integration.md to development/"
fi

if [ -f "docs/backend-checklist.md" ]; then
    mv docs/backend-checklist.md docs/development/
    echo "  ✓ Moved backend-checklist.md to development/"
fi

if [ -f "docs/Role_Based_Dashboards_Navigation_Checklist.md" ]; then
    mv docs/Role_Based_Dashboards_Navigation_Checklist.md docs/development/dashboard-navigation.md
    echo "  ✓ Moved Role_Based_Dashboards_Navigation_Checklist.md to development/dashboard-navigation.md"
fi

if [ -f "docs/Backend_Page_Build_Progress_Checklist.md" ]; then
    mv docs/Backend_Page_Build_Progress_Checklist.md docs/development/backend-progress.md
    echo "  ✓ Moved Backend_Page_Build_Progress_Checklist.md to development/backend-progress.md"
fi

if [ -f "docs/CX_Symphony_Architecture_UX_Guide.md" ]; then
    mv docs/CX_Symphony_Architecture_UX_Guide.md docs/development/cx-symphony-architecture.md
    echo "  ✓ Moved CX_Symphony_Architecture_UX_Guide.md to development/cx-symphony-architecture.md"
fi

if [ -f "docs/development.md" ]; then
    mv docs/development.md docs/development/README.md
    echo "  ✓ Moved development.md to development/README.md"
fi

# Implementation files
if [ -f "docs/admin-page-design-checklist.md" ]; then
    mv docs/admin-page-design-checklist.md docs/implementation/admin-design-checklist.md
    echo "  ✓ Moved admin-page-design-checklist.md to implementation/admin-design-checklist.md"
fi

if [ -f "docs/AI_Social_Media_Features_Checklist.md" ]; then
    mv docs/AI_Social_Media_Features_Checklist.md docs/implementation/social-media-features.md
    echo "  ✓ Moved AI_Social_Media_Features_Checklist.md to implementation/social-media-features.md"
fi

if [ -f "docs/Medical_Industry_Workflow_Checklist.md" ]; then
    mv docs/Medical_Industry_Workflow_Checklist.md docs/implementation/medical-workflow-checklist.md
    echo "  ✓ Moved Medical_Industry_Workflow_Checklist.md to implementation/medical-workflow-checklist.md"
fi

if [ -f "docs/Industry_Agnostic_Workflow_Implementation_Roadmap.md" ]; then
    mv docs/Industry_Agnostic_Workflow_Implementation_Roadmap.md docs/implementation/workflow-roadmap.md
    echo "  ✓ Moved Industry_Agnostic_Workflow_Implementation_Roadmap.md to implementation/workflow-roadmap.md"
fi

if [ -f "docs/implementation/DEMO_MANUAL_QA_CHECKLIST.md" ]; then
    mv docs/implementation/DEMO_MANUAL_QA_CHECKLIST.md docs/testing/manual-qa-checklist.md
    echo "  ✓ Moved DEMO_MANUAL_QA_CHECKLIST.md to testing/manual-qa-checklist.md"
fi

# Business files
if [ -f "docs/Support_Process_Checklist.md" ]; then
    mv docs/Support_Process_Checklist.md docs/business/support-process.md
    echo "  ✓ Moved Support_Process_Checklist.md to business/support-process.md"
fi

if [ -f "docs/Post_Launch_Analytics_Review_Guide.md" ]; then
    mv docs/Post_Launch_Analytics_Review_Guide.md docs/business/analytics-review.md
    echo "  ✓ Moved Post_Launch_Analytics_Review_Guide.md to business/analytics-review.md"
fi

if [ -f "docs/Onboarding_New_Industries.md" ]; then
    mv docs/Onboarding_New_Industries.md docs/business/industry-onboarding.md
    echo "  ✓ Moved Onboarding_New_Industries.md to business/industry-onboarding.md"
fi

if [ -f "docs/Launch_Announcement_Email_Template.md" ]; then
    mv docs/Launch_Announcement_Email_Template.md docs/business/launch-announcement.md
    echo "  ✓ Moved Launch_Announcement_Email_Template.md to business/launch-announcement.md"
fi

if [ -f "docs/Beta_Test_Feedback_Form_Template.md" ]; then
    mv docs/Beta_Test_Feedback_Form_Template.md docs/business/beta-test-feedback.md
    echo "  ✓ Moved Beta_Test_Feedback_Form_Template.md to business/beta-test-feedback.md"
fi

# Testing files
if [ -f "docs/End_to_End_Demo_Flow_Test_Checklist.md" ]; then
    mv docs/End_to_End_Demo_Flow_Test_Checklist.md docs/testing/demo-flow-testing.md
    echo "  ✓ Moved End_to_End_Demo_Flow_Test_Checklist.md to testing/demo-flow-testing.md"
fi

# Deployment files
if [ -f "docs/Production_Ready_Platform_Comprehensive_Checklist.md" ]; then
    mv docs/Production_Ready_Platform_Comprehensive_Checklist.md docs/deployment/production-checklist.md
    echo "  ✓ Moved Production_Ready_Platform_Comprehensive_Checklist.md to deployment/production-checklist.md"
fi

if [ -f "docs/implementation/GO_LIVE_CHECKLIST.md" ]; then
    mv docs/implementation/GO_LIVE_CHECKLIST.md docs/deployment/go-live-checklist.md
    echo "  ✓ Moved GO_LIVE_CHECKLIST.md to deployment/go-live-checklist.md"
fi

# API files
if [ -f "docs/API.md" ]; then
    mv docs/API.md docs/api/README.md
    echo "  ✓ Moved API.md to api/README.md"
fi

# Delete outdated/duplicate files
echo "🗑️  Removing outdated and duplicate files..."

# Root level files to delete
FILES_TO_DELETE=(
    "docs/PLATFORM_MASTER_DOCUMENTATION.md"
    "docs/autopilotcx_design_templates_spec.md"
    "docs/Multi-Agent-AI-Clinic-Management-with-WhatsApp-Telegram-Google-Calendar.json"
    "docs/Handoff_Backend_Frontend_Connection_V0.md"
    "docs/AutopilotCX_User_Tiers_Monetization_v7.txt"
    "docs/AutopilotCX_Sitemap_UserFlows.md"
    "docs/AutopilotCX_CX_Symphony_Agent_Spec_v1.txt"
    "docs/AutopilotCX CX_CI Bookings and Interactions Plan for Dr.markdown"
)

for file in "${FILES_TO_DELETE[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
        echo "  ✓ Deleted $file"
    fi
done

# Foundation files to delete
FOUNDATION_FILES_TO_DELETE=(
    "docs/foundation/PLATFORM_MASTER_DOCUMENTATION.md"
    "docs/foundation/DESIGN_SYSTEM_INFORMATION.md"
    "docs/foundation/Master_Autopilotcx_Project_Structure.md"
    "docs/foundation/autopilotcx_spec_v2-updated-04-27-2025.md"
    "docs/foundation/AutopilotCX-Complete-Frontend-04-29-2025.markdown"
    "docs/foundation/env-local-info.txt"
    "docs/foundation/Top-10-EHR-CRM-Sytems.md"
    "docs/foundation/LLM_Model_Analysis.md"
    "docs/foundation/AutopilotCX_Hootsuite_Feature_Parity_Checklist.md"
)

for file in "${FOUNDATION_FILES_TO_DELETE[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
        echo "  ✓ Deleted $file"
    fi
done

# Implementation files to delete
IMPLEMENTATION_FILES_TO_DELETE=(
    "docs/implementation/DEMO_IMPLEMENTATION_CHECKLIST.md"
    "docs/implementation/DEMO_DEVELOPMENT_HANDOFF.md"
    "docs/implementation/DEMO-FUNCTIONALITY-UNDERSTANDING.md"
    "docs/implementation/DEMO_MANUAL_DATA_LOADING_CHECKLIST.md"
    "docs/implementation/DEMO-IMPLEMENTATON-DR-HASSAN.MD"
    "docs/implementation/FINAL-DR-HASSAN-DEMO-IMPLEMENTATION-HANDOFF-MAY-18.MD"
    "docs/implementation/DEMO-AND-FULL-WORKFLOW-CHECKLIST-MEDICAL.MD"
    "docs/implementation/Top 10 USA-Based Authoritative Websites for Healthcare Industry Categories.markdown"
    "docs/implementation/End-to-End Demo Patient Journey: Dr. Hassan's Pain Management Demo.md"
)

for file in "${IMPLEMENTATION_FILES_TO_DELETE[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
        echo "  ✓ Deleted $file"
    fi
done

# Create README files for new directories
echo "📝 Creating README files for new directories..."

cat > docs/development/README.md << 'EOF'
# Development Documentation

This directory contains development-related documentation for AutopilotCX.

## Contents

- **frontend-auth-integration.md** - Frontend authentication integration guide
- **backend-checklist.md** - Backend development checklist
- **dashboard-navigation.md** - Dashboard navigation and role-based access
- **backend-progress.md** - Backend development progress tracking
- **cx-symphony-architecture.md** - CX Symphony architecture and UX guide

## Getting Started

For developers new to AutopilotCX, start with the backend checklist and frontend authentication integration guide.
EOF

cat > docs/implementation/README.md << 'EOF'
# Implementation Documentation

This directory contains implementation guides and checklists for AutopilotCX features.

## Contents

- **admin-design-checklist.md** - Admin page design requirements
- **social-media-features.md** - Social media features implementation
- **medical-workflow-checklist.md** - Medical industry workflow requirements
- **workflow-roadmap.md** - Workflow implementation roadmap
- **ehr-integration-checklist.md** - EHR integration implementation guide

## Implementation Process

1. Review the relevant checklist for your feature
2. Follow the implementation roadmap
3. Use the design checklists for UI/UX requirements
4. Test thoroughly before deployment
EOF

cat > docs/business/README.md << 'EOF'
# Business Documentation

This directory contains business process documentation and templates.

## Contents

- **support-process.md** - Support process checklist and procedures
- **analytics-review.md** - Post-launch analytics review guide
- **industry-onboarding.md** - New industry onboarding process
- **launch-announcement.md** - Launch announcement email template
- **beta-test-feedback.md** - Beta test feedback form template

## Business Processes

These documents outline the business processes and procedures for operating AutopilotCX effectively.
EOF

cat > docs/testing/README.md << 'EOF'
# Testing Documentation

This directory contains testing procedures and checklists.

## Contents

- **demo-flow-testing.md** - End-to-end demo flow testing checklist
- **manual-qa-checklist.md** - Manual QA testing procedures

## Testing Process

1. Follow the demo flow testing checklist for new features
2. Use manual QA procedures for thorough testing
3. Document any issues found during testing
EOF

cat > docs/deployment/README.md << 'EOF'
# Deployment Documentation

This directory contains deployment and production documentation.

## Contents

- **production-checklist.md** - Production readiness checklist
- **go-live-checklist.md** - Go-live procedures and requirements

## Deployment Process

1. Complete the production readiness checklist
2. Follow go-live procedures for deployment
3. Monitor system health post-deployment
EOF

echo "✅ Documentation cleanup completed successfully!"
echo "📁 New structure created:"
echo "   - docs/development/"
echo "   - docs/implementation/"
echo "   - docs/business/"
echo "   - docs/testing/"
echo "   - docs/deployment/"
echo ""
echo "📦 Backup created at: $BACKUP_DIR"
echo ""
echo "🔍 Next steps:"
echo "   1. Review the new structure"
echo "   2. Update any internal links in documentation"
echo "   3. Test that all documentation is accessible"
echo "   4. Remove the backup directory when satisfied" 